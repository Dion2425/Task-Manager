using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Roles;
public class RoleCreateDto
{
    [Required(ErrorMessage = "Emertimi i rolit eshte i detyrueshem")]
    [MaxLength(100)]
    public string Emertimi { get; set; } = string.Empty;

    [MaxLength(250)]
    public string Pershkrimi { get; set; } = string.Empty;
}