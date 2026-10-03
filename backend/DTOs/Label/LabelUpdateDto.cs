using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Label;
public class LabelUpdateDto
{
    [Required]
    [MaxLength(100)]
    public string Emertimi { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")]
    public string Ngjyra { get; set; } = string.Empty;
}