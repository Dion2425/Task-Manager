using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.Data;
using backend.Models.Identity;
using backend.DTOs.Sprints;

namespace backend.Controllers;

[ApiController]
[Route("api/sprint")]
[Authorize]
public class SprintsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public SprintsController(ApplicationDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? projectId)
    {
        var sprint = _db.Sprints
            .Include(s => s.Project)
            .AsQueryable();

        if (projectId.HasValue)
            sprint = sprint.Where(s => s.ProjectId == projectId.Value);

        return Ok(_mapper.Map<List<SprintReadDto>>(await sprint.ToListAsync()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var sprint = await _db.Sprints
            .Include(s => s.Project)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sprint == null)
            return NotFound();


        return Ok(_mapper.Map<SprintReadDto>(sprint));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Menaxher")]
    public async Task<IActionResult> Create([FromBody] SprintCreateDto dto)
    {
        if (dto == null)
            return BadRequest("Sprint payload is required.");

        var sprint = _mapper.Map<Sprint>(dto);

        _db.Sprints.Add(sprint);

        await _db.SaveChangesAsync();

        await _db.Entry(sprint).Reference(s => s.Project).LoadAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = sprint.Id },
            _mapper.Map<SprintReadDto>(sprint)
        );
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Menaxher")]
    public async Task<IActionResult> Update(int id,[FromBody] SprintUpdateDto dto)
    {
        var sprint = await _db.Sprints
            .Include(s => s.Project)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sprint == null)
            return NotFound();

        _mapper.Map(dto, sprint);

        await _db.SaveChangesAsync();

        return Ok(_mapper.Map<SprintReadDto>(sprint));
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin,Menaxher")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] SprintStatusDto dto)
    {
        var sprint = await _db.Sprints
            .Include(s => s.Project)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sprint == null) return NotFound();

        _mapper.Map(dto, sprint);
        await _db.SaveChangesAsync();
        return Ok(_mapper.Map<SprintReadDto>(sprint));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Menaxher")]
    public async Task<IActionResult> Delete(int id)
    {
        var sprint = await _db.Sprints.FindAsync(id);

        if (sprint == null)
            return NotFound();
        
        _db.Sprints.Remove(sprint);

        await _db.SaveChangesAsync();

        return NoContent();
    }
}