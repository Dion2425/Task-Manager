using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Sprints;
public class SprintCreateDto
{
    [Required]
    public int ProjectId { get; set; }

    [Required(ErrorMessage = "Emertimi i sprintit eshte i detyrueshem")]
    [MaxLength(200)]
    public string Emertimi { get; set; } = string.Empty;

    [Required(ErrorMessage = "Data e fillimit eshte e detyrueshme")]
    public DateTime DataFillimit { get; set; }

    [Required(ErrorMessage = "Data e perfundimit eshte e detyrueshme")]
    public DateTime DataPerfundimit { get; set; }
}