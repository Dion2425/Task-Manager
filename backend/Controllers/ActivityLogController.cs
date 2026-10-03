using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.Data;
using backend.Models.Identity;
using backend.DTOs.ActivityLog;

namespace backend.Controllers;

[ApiController]
[Route("api/activity")]
[Authorize]
public class ActivityLogController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public ActivityLogController(
        ApplicationDbContext db,
        IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ActivityLogFilterDto filter)
    {
        var query = _db.ActivityLogs.Include(a => a.Project).Include(a => a.User).AsQueryable();

        if (filter.ProjectId.HasValue)
            query = query.Where(a => a.ProjectId == filter.ProjectId.Value);
        if (filter.UserId.HasValue)
            query = query.Where(a => a.UserId == filter.UserId.Value);
        if (filter.DateFrom.HasValue)
            query = query.Where(a => a.Data >= filter.DateFrom.Value);
        if (filter.DateTo.HasValue)
            query = query.Where(a => a.Data <= filter.DateTo.Value);
        if (!string.IsNullOrWhiteSpace(filter.Veprimi))
            query = query.Where(a => a.Veprimi == filter.Veprimi);

        var logs = await query
            .OrderByDescending(a => a.Data)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return Ok(_mapper.Map<List<ActivityLogReadDto>>(logs));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var activitylogs = await _db.ActivityLogs
            .Include(a => a.Project)
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (activitylogs == null)
            return NotFound();

        return Ok(_mapper.Map<ActivityLogReadDto>(activitylogs));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ActivityLogCreateDto dto)
    {
        if (dto == null)
            return BadRequest("Activity log payload is required.");

        var activitylogs = _mapper.Map<ActivityLog>(dto);

        _db.ActivityLogs.Add(activitylogs);

        await _db.SaveChangesAsync();

        await _db.Entry(activitylogs).Reference(a => a.Project).LoadAsync();
        await _db.Entry(activitylogs).Reference(a => a.User).LoadAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = activitylogs.Id },
            _mapper.Map<ActivityLogReadDto>(activitylogs)
        );
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var activitylogs = await _db.ActivityLogs.FindAsync(id);

        if (activitylogs == null)
            return NotFound();

        _db.ActivityLogs.Remove(activitylogs);

        await _db.SaveChangesAsync();

        return NoContent();
    }
}