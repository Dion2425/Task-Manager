using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Projects;
public class ProjectCreateDto
{
    [Required(ErrorMessage = "Emertimi i projektit eshte i detyrueshem")]
    [MaxLength(200)]
    public string Emertimi { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Pershkrimi { get; set; } = string.Empty;

    [Required(ErrorMessage = "Data e perfundimit eshte e detyrueshme")]
    public DateTime DataPerfundimit { get; set; }

    [Required]
    public int OwnerId { get; set; }
}