using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.Data;
using backend.DTOs.Roles;
using backend.Models.Identity;

namespace backend.Controllers;

[ApiController]
[Route("api/role")]
[Authorize(Roles = "Admin")]
public class RolesController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public RolesController(
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
        var roles = await _db.Roles.ToListAsync();

        return Ok(_mapper.Map<List<RoleReadDto>>(roles));
    }

    // Merr nje rol sipas ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var role = await _db.Roles.FindAsync(id);

        if (role == null)
            return NotFound();

        return Ok(_mapper.Map<RoleReadDto>(role));
    }

    // Krijo rol te ri
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] RoleCreateDto dto)
    {
        if (dto == null)
            return BadRequest("Role payload is required.");

        var role = _mapper.Map<Role>(dto);

        _db.Roles.Add(role);

        await _db.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = role.Id },
            _mapper.Map<RoleReadDto>(role)
        );
    }

    // Modifiko rolin
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] RoleUpdateDto dto)
    {
        var role = await _db.Roles.FindAsync(id);

        if (role == null)
            return NotFound();

        _mapper.Map(dto, role);

        await _db.SaveChangesAsync();

        return NoContent();
    }

    // Fshi rolin
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var role = await _db.Roles.FindAsync(id);

        if (role == null)
            return NotFound();

        _db.Roles.Remove(role);

        await _db.SaveChangesAsync();

        return NoContent();
    }
}