namespace backend.DTOs.Projects;
public class ProjectReadDto
{
    public int Id { get; set; }
    public string Emertimi { get; set; } = string.Empty;
    public string Pershkrimi { get; set; } = string.Empty;
    public DateTime DataFillimit { get; set; }
    public DateTime DataPerfundimit { get; set; }
    public string Statusi { get; set; } = string.Empty;
    public int OwnerId { get; set; }
    public string EmriPronarit { get; set; } = string.Empty;
    public int NumriAnetareve { get; set; }
    public int NumriDetyrave { get; set; }
    public int DetyratPerfunduara { get; set; }
    public double PerqindjaProgresit =>
        NumriDetyrave > 0 ? Math.Round((double)DetyratPerfunduara / NumriDetyrave * 100, 1) : 0;
}