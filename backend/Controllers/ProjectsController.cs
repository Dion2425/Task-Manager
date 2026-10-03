using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.Data;
using backend.DTOs.Projects;
using backend.Models.Identity;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/project")]
[Authorize(Roles = "Admin,Menaxher,Perdorues")]
public class ProjectsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public ProjectsController(ApplicationDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var query = _db.Projects
            .Include(p => p.Owner)
            .Include(p => p.Anetaret)
            .Include(p => p.Detyrat)
            .AsQueryable();

        if (User.IsInRole("Perdorues") && !User.IsInRole("Admin") && !User.IsInRole("Menaxher"))
        {
            var userIdStr = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdStr, out int userId))
            {
                query = query.Where(p => p.OwnerId == userId || p.Anetaret.Any(a => a.UserId == userId));
            }
        }

        var projects = await query.ToListAsync();

        return Ok(_mapper.Map<List<ProjectReadDto>>(projects));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var project = await _db.Projects
            .Include(p => p.Owner)
            .Include(p => p.Anetaret)
                .ThenInclude(a => a.User)
            .Include(p => p.Detyrat)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null)
            return NotFound();

        return Ok(_mapper.Map<ProjectReadDto>(project));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Menaxher")]
    public async Task<IActionResult> Create([FromBody] ProjectCreateDto dto)
    {
        if (dto == null)
            return BadRequest("Project payload is required.");

        var project = _mapper.Map<Project>(dto);

        project.Statusi = "Aktiv";

        _db.Projects.Add(project);

        await _db.SaveChangesAsync();

        await _db.Entry(project).Reference(p => p.Owner).LoadAsync();

        return CreatedAtAction(nameof(GetById), new { id = project.Id},
            _mapper.Map<ProjectReadDto>(project)
        );
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Menaxher")]
    public async Task<IActionResult> Update(int id, [FromBody] ProjectUpdateDto dto)
    {
        if (dto == null)
            return BadRequest("Project update payload is required.");

        var project = await _db.Projects
            .Include(p => p.Owner)
            .Include(p => p.Anetaret)
            .Include(p => p.Detyrat)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null)
            return NotFound();

        _mapper.Map(dto, project);

        await _db.SaveChangesAsync();

        return Ok(_mapper.Map<ProjectReadDto>(project));
    }
    
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin,Menaxher")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] ProjectStatusDto dto)
    {
        if (dto == null)
            return BadRequest("Project status payload is required.");

        var project = await _db.Projects
            .Include(p => p.Owner)
            .Include(p => p.Anetaret)
            .Include(p => p.Detyrat)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null) return NotFound();

        _mapper.Map(dto, project);
        await _db.SaveChangesAsync();
        return Ok(_mapper.Map<ProjectReadDto>(project));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var project = await _db.Projects.FindAsync(id);

        if (project == null)
            return NotFound();

        _db.Projects.Remove(project);

        await _db.SaveChangesAsync();

        return NoContent();
    }
}