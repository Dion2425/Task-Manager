using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.Data;
using backend.DTOs.Tasks;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/task")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public TasksController(
        ApplicationDbContext db,
        IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? projectId)
    {
        var query = _db.Tasks
            .Include(t => t.Project)
            .Include(t => t.PerdoruesiCaktuar)
            .Include(t => t.Komentet)
            .Include(t => t.Bashkangjitjet)
            .Include(t => t.Etiketat)
                .ThenInclude(tl => tl.Label)
            .AsQueryable();

        if (projectId.HasValue)
            query = query.Where(t => t.ProjectId == projectId.Value);

        if (User.IsInRole("Perdorues") && !User.IsInRole("Admin") && !User.IsInRole("Menaxher"))
        {
            var userIdStr = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdStr, out int userId))
            {
                query = query.Where(t => t.AssignedTo == userId);
            }
        }

        var tasks = await query.ToListAsync();

        return Ok(_mapper.Map<List<TaskReadDto>>(tasks));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _db.Tasks
            .Include(t => t.Project)
            .Include(t => t.PerdoruesiCaktuar)
            .Include(t => t.Komentet)
                .ThenInclude(k => k.User)
            .Include(t => t.Etiketat)
                .ThenInclude(tl => tl.Label)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
            return NotFound();

        return Ok(_mapper.Map<TaskReadDto>(task));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Menaxher")]
    public async Task<IActionResult> Create(
        [FromBody] TaskCreateDto dto)
    {
        if (dto == null)
            return BadRequest("Task payload is required.");

        var task = _mapper.Map<backend.Models.Identity.Task>(dto);

        _db.Tasks.Add(task);

        await _db.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = task.Id },
            _mapper.Map<TaskReadDto>(task)
        );
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Menaxher")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] TaskUpdateDto dto)
    {
        var task = await _db.Tasks.FindAsync(id);

        if (task == null)
            return NotFound();

        _mapper.Map(dto, task);

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPatch("{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] TaskStatusUpdateDto dto)
    {
        var task = await _db.Tasks.FindAsync(id);

        if (task == null)
            return NotFound();

        task.Statusi = dto.Statusi;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    // Fshi detyren
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Menaxher")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _db.Tasks.FindAsync(id);

        if (task == null)
            return NotFound();

        _db.Tasks.Remove(task);

        await _db.SaveChangesAsync();

        return NoContent();
    }
}