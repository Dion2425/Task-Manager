using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Data;
using backend.DTOs.Auth;
using backend.DTOs.Users;
using backend.DTOs.Token;
using backend.Models.Identity;
using AutoMapper;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;

    public AuthController(
        ApplicationDbContext db,
        IConfiguration config,
        IMapper mapper)
    {
        _db = db;
        _config = config;
        _mapper = mapper;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (dto == null)
            return BadRequest("Registration payload is required.");

        // Kontrollo nese email ekziston
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email-i ekziston tashme.");

        var user = new User
        {
            Emri = dto.Emri,
            Mbiemri = dto.Mbiemri,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            DataKrijimit = DateTime.UtcNow,
            Statusi = true,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var role = await _db.Roles
            .FirstOrDefaultAsync(r => r.NormalizedName == "PERDORUES");

        if (role != null)
        {
            _db.UserRoles.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = role.Id
            });

            await _db.SaveChangesAsync();
        }

        return Ok(new{message = "Regjistrimi u krye me sukses!"});
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (dto == null)
            return BadRequest("Login payload is required.");

        var user = await _db.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            return Unauthorized("Email ose fjalekalimi i pasakte.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Email ose fjalekalimi i pasakte.");

        if (!user.Statusi)
            return Unauthorized("Llogaria eshte joaktive.");

        var accessToken = GenerateAccessToken(user);
        var refreshToken = GenerateRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            Token = refreshToken,
            Created = DateTime.UtcNow,
            Expires = DateTime.UtcNow.AddDays(int.Parse(_config["Jwt:RefreshTokenExpirationDays"]!))
        });

        await _db.SaveChangesAsync();

        return Ok(new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(
                int.Parse(_config["Jwt:AccessTokenExpirationMinutes"]!)
            ),
            User = _mapper.Map<UserReadDto>(user)
        });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(
        [FromBody] RefreshTokenRequestDto dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.RefreshToken))
            return BadRequest("Refresh token is required.");

        var token = await _db.RefreshTokens
            .Include(t => t.User)
                .ThenInclude(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(t => t.Token == dto.RefreshToken);

        if (token == null || !token.IsActive)
            return Unauthorized("Refresh token i pasakte ose i skaduar.");

        token.Revoked = DateTime.UtcNow;

        var newRefreshToken = GenerateRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = token.UserId,
            Token = newRefreshToken,
            Created = DateTime.UtcNow,
            Expires = DateTime.UtcNow.AddDays(int.Parse(_config["Jwt:RefreshTokenExpirationDays"]!)
            )
        });

        await _db.SaveChangesAsync();

        return Ok(new{accessToken = GenerateAccessToken(token.User), refreshToken = newRefreshToken});
    }

    private string GenerateAccessToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(
                ClaimTypes.Name,
                $"{user.Emri} {user.Mbiemri}"
            )
        };

        foreach (var ur in user.UserRoles ?? Array.Empty<UserRole>())
        {
            claims.Add(
                new Claim(ClaimTypes.Role, ur.Role.Emertimi)
            );
        }

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
        );

        var creds = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(_config["Jwt:AccessTokenExpirationMinutes"]!)
            ),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var bytes = new byte[64];

        RandomNumberGenerator.Fill(bytes);

        return Convert.ToBase64String(bytes);
    }
}