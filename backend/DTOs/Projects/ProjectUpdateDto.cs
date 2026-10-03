using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Projects;
public class ProjectUpdateDto
{
    [Required]
    [MaxLength(200)]
    public string Emertimi { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Pershkrimi { get; set; } = string.Empty;

    [Required]
    public DateTime DataFillimit { get; set; }

    [Required]
    public DateTime DataPerfundimit { get; set; }

    [MaxLength(50)]
    public string Statusi { get; set; } = "Aktiv";
}