using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Roles;
public class RoleUpdateDto
{
    [Required]
    [MaxLength(100)]
    public string Emertimi { get; set; } = string.Empty;

    [MaxLength(250)]
    public string Pershkrimi { get; set; } = string.Empty;
}