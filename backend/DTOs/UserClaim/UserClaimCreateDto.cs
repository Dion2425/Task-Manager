using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.UserClaim;
public class UserClaimCreateDto
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public string ClaimType { get; set; } = string.Empty;

    [Required]
    public string ClaimValue { get; set; } = string.Empty;
}