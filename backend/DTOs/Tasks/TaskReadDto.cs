namespace backend.DTOs.Tasks;
public class TaskReadDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string EmriProjektit { get; set; } = string.Empty;
    public string Titulli { get; set; } = string.Empty;
    public string Pershkrimi { get; set; } = string.Empty;
    public string Prioriteti { get; set; } = string.Empty;
    public string Statusi { get; set; } = string.Empty;
    public int? AssignedTo { get; set; }
    public string? EmriPerdoruesitCaktuar { get; set; }
    public DateTime? DataAfatit { get; set; }
    public bool EshteVonuar => DataAfatit.HasValue && DataAfatit.Value < DateTime.UtcNow && Statusi != "Perfunduar";
    public int NumriKomenteve { get; set; }
    public int NumriBashkangjitjeve { get; set; }
    public List<string> Etiketat { get; set; } = new();
}