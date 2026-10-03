using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.Data;
using backend.DTOs.Users;
using backend.Models.Identity;

namespace backend.Controllers;

[ApiController]
[Route("api/user")] 
[Authorize(Roles = "Admin,Menaxher")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public UsersController(
        ApplicationDbContext db,
        IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    // Merr te gjithe perdoruesit
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _db.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .ToListAsync();

        return Ok(_mapper.Map<List<UserReadDto>>(users));
    }

    // Merr nje perdorues sipas ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _db.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound();

        return Ok(_mapper.Map<UserReadDto>(user));
    }

    // Krijo nje perdorues te ri
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] UserCreateDto dto)
    {
        if (dto == null)
            return BadRequest("User payload is required.");

        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email already exists.");

        var user = _mapper.Map<User>(dto);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        user.DataKrijimit = DateTime.UtcNow;
        user.Statusi = true;

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        if (dto.RoleIds.Any())
        {
            var roles = await _db.Roles.Where(r => dto.RoleIds.Contains(r.Id)).ToListAsync();
            foreach (var role in roles)
            {
                _db.UserRoles.Add(new UserRole
                {
                    UserId = user.Id,
                    RoleId = role.Id
                });
            }
            await _db.SaveChangesAsync();
        }

        await _db.Entry(user).Collection(u => u.UserRoles).LoadAsync();
        await _db.Entry(user).Collection(u => u.UserRoles).Query().Include(ur => ur.Role).LoadAsync();

        return CreatedAtAction(nameof(GetById), new { id = user.Id }, _mapper.Map<UserReadDto>(user));
    }

    // Modifiko perdoruesin
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UserUpdateDto dto)
    {
        var user = await _db.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound();

        _mapper.Map(dto, user);

        if (dto.RoleIds != null)
        {
            var existingRoleIds = user.UserRoles.Select(ur => ur.RoleId).ToList();
            var newRoleIds = dto.RoleIds.Distinct().ToList();

            var rolesToRemove = existingRoleIds.Except(newRoleIds).ToList();
            var rolesToAdd = newRoleIds.Except(existingRoleIds).ToList();

            if (rolesToRemove.Any())
            {
                var toRemove = user.UserRoles.Where(ur => rolesToRemove.Contains(ur.RoleId)).ToList();
                _db.UserRoles.RemoveRange(toRemove);
            }

            if (rolesToAdd.Any())
            {
                var validRoles = await _db.Roles.Where(r => rolesToAdd.Contains(r.Id)).ToListAsync();
                foreach (var role in validRoles)
                {
                    user.UserRoles.Add(new UserRole
                    {
                        UserId = user.Id,
                        RoleId = role.Id
                    });
                }
            }
        }

        await _db.SaveChangesAsync();

        return NoContent();
    }

    // Aktivizo ose deaktivizo perdoruesin
    [HttpPatch("{id}/toggle-status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        var user = await _db.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        user.Statusi = !user.Statusi;

        await _db.SaveChangesAsync();

        return Ok(new{statusi = user.Statusi});
    }

    // Fshi perdoruesin
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _db.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        _db.Users.Remove(user);

        await _db.SaveChangesAsync();

        return NoContent();
    }
}