using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Label;
public class LabelCreateDto
{
    [Required(ErrorMessage = "Emertimi i etiketes eshte i detyrueshem")]
    [MaxLength(100)]
    public string Emertimi { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ngjyra eshte e detyrueshme")]
    [RegularExpression(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
        ErrorMessage = "Ngjyra duhet te jete ne formatin hex (p.sh. #3498db)")]
    public string Ngjyra { get; set; } = "#3498db";
}