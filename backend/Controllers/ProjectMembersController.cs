using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.Data;
using backend.Models.Identity;
using backend.DTOs.ProjectMember;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/pmember")]
[Authorize]
public class ProjectMembersController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public ProjectMembersController(ApplicationDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? projectId)
    {
        var projectmembers = _db.ProjectMembers.Include(pm => pm.Project).Include(pm => pm.User).AsQueryable();

        if (projectId.HasValue)
            projectmembers = projectmembers.Where(pm => pm.ProjectId == projectId.Value);

        if (User.IsInRole("Perdorues") && !User.IsInRole("Admin") && !User.IsInRole("Menaxher"))
        {
            var userIdStr = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdStr, out int userId))
            {
                var userProjectIds = _db.Projects
                    .Where(p => p.OwnerId == userId || p.Anetaret.Any(a => a.UserId == userId))
                    .Select(p => p.Id);

                projectmembers = projectmembers.Where(pm => userProjectIds.Contains(pm.ProjectId));
            }
        }

        return Ok(_mapper.Map<List<ProjectMemberReadDto>>(await projectmembers.ToListAsync()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var projectmember = await _db.ProjectMembers.Include(pm => pm.Project).Include(pm => pm.User).FirstOrDefaultAsync(pm => pm.Id == id);

        if (projectmember == null) return NotFound();

        return Ok(_mapper.Map<ProjectMemberReadDto>(projectmember));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Menaxher")]
    public async Task<IActionResult> Create([FromBody] ProjectMemberCreateDto dto)
    {
        if (dto == null)
            return BadRequest("Project member payload is required.");

        if (await _db.ProjectMembers.AnyAsync(pm => pm.ProjectId == dto.ProjectId && pm.UserId == dto.UserId))
            return BadRequest(new {message = "Përdoruesi është tashmë anëtar i këtij projekti."});
        
        var projectmember = _mapper.Map<ProjectMember>(dto);

        _db.ProjectMembers.Add(projectmember);

        await _db.SaveChangesAsync();

        await _db.Entry(projectmember).Reference(m => m.Project).LoadAsync();
        await _db.Entry(projectmember).Reference(m => m.User).LoadAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = projectmember.Id },
            _mapper.Map<ProjectMemberReadDto>(projectmember)
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProjectMemberUpdateDto dto)
    {
        var projectmember = await _db.ProjectMembers.Include(pm => pm.Project).Include(pm => pm.User).FirstOrDefaultAsync(pm => pm.Id == id);

        if (projectmember == null)
            return NotFound();

        _mapper.Map(dto, projectmember);

        await _db.SaveChangesAsync();

        return Ok(_mapper.Map<ProjectMemberReadDto>(projectmember));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Menaxher")]
    public async Task<IActionResult> Delete(int id)
    {
        var projectmember = await _db.ProjectMembers.FindAsync(id);

        if (projectmember == null)
            return NotFound();

        _db.ProjectMembers.Remove(projectmember);

        await _db.SaveChangesAsync();

        return NoContent();
    }
}