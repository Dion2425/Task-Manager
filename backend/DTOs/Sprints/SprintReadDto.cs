namespace backend.DTOs.Sprints;
public class SprintReadDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string EmriProjektit { get; set; } = string.Empty;
    public string Emertimi { get; set; } = string.Empty;
    public DateTime DataFillimit { get; set; }
    public DateTime DataPerfundimit { get; set; }
    public string Statusi { get; set; } = string.Empty;
    public int DiteteMbetura =>
        Statusi != "Perfunduar"
            ? Math.Max(0, (int)(DataPerfundimit - DateTime.UtcNow).TotalDays)
            : 0;
}