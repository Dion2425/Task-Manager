using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.Data;
using backend.Models.Identity;
using backend.DTOs.Label;

namespace backend.Controllers;

[ApiController]
[Route("api/label")]
[Authorize]
public class LabelsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public LabelsController(
        ApplicationDbContext db,
        IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    // Merr te gjitha rolet
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var label = await _db.Labels.ToListAsync();

        return Ok(_mapper.Map<List<LabelReadDto>>(label));
    }

    // Merr nje rol sipas ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var label = await _db.Labels.FindAsync(id);

        if (label == null)
            return NotFound();

        return Ok(_mapper.Map<LabelReadDto>(label));
    }

    // Krijo rol te ri
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] LabelCreateDto dto)
    {
        if (dto == null)
            return BadRequest("Label payload is required.");

        var label = _mapper.Map<Label>(dto);

        _db.Labels.Add(label);

        await _db.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = label.Id },
            _mapper.Map<LabelReadDto>(label)
        );
    }

    // Modifiko rolin
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] LabelUpdateDto dto)
    {
        var label = await _db.Labels.FindAsync(id);

        if (label == null)
            return NotFound();

        _mapper.Map(dto, label);

        await _db.SaveChangesAsync();

        return NoContent();
    }

    // Fshi rolin
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var label = await _db.Labels.FindAsync(id);

        if (label == null)
            return NotFound();

        _db.Labels.Remove(label);

        await _db.SaveChangesAsync();

        return NoContent();
    }
}