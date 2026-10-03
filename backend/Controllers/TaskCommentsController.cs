using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.Data;
using backend.Models.Identity;
using backend.DTOs.TaskComment;

namespace backend.Controllers;

[ApiController]
[Route("api/taskcomment")]
[Authorize]
public class TaskCommentsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public TaskCommentsController(
        ApplicationDbContext db,
        IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? taskId)
    {
        var taskcomment = _db.TaskComments
            .Include(tc => tc.User)
            .AsQueryable();
        
        if (taskId.HasValue)
            taskcomment = taskcomment.Where(tc => tc.TaskId == taskId.Value);

        return Ok(_mapper.Map<List<TaskCommentReadDto>>(
            await taskcomment.OrderBy(tc => tc.Data).ToListAsync()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var taskcomment = await _db.TaskComments
            .Include(tc => tc.User)
            .FirstOrDefaultAsync(tc => tc.Id == id);

        if (taskcomment == null)
            return NotFound();

        return Ok(_mapper.Map<TaskCommentReadDto>(taskcomment));
    }

   [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] TaskCommentCreateDto dto)
    {
        if (dto == null)
            return BadRequest("Task comment payload is required.");

        var taskcomment = _mapper.Map<TaskComment>(dto);

        _db.TaskComments.Add(taskcomment);

        await _db.SaveChangesAsync();

        await _db.Entry(taskcomment).Reference(c => c.User).LoadAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = taskcomment.Id },
            _mapper.Map<TaskCommentReadDto>(taskcomment)
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TaskCommentUpdateDto dto)
    {
        var taskcomment = await _db.TaskComments
            .Include(tc => tc.User)
            .FirstOrDefaultAsync(tc => tc.Id == id);

        if (taskcomment == null)
            return NotFound();

        _mapper.Map(dto, taskcomment);

        await _db.SaveChangesAsync();

        return Ok(_mapper.Map<TaskCommentReadDto>(taskcomment));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var taskcomment = await _db.TaskComments.FindAsync(id);

        if (taskcomment == null)
            return NotFound();

        _db.TaskComments.Remove(taskcomment);

        await _db.SaveChangesAsync();

        return NoContent();
    }
}