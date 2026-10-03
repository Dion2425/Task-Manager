namespace backend.DTOs.ActivityLog;
public class ActivityLogReadDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string EmriProjektit { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string EmriPerdoruesit { get; set; } = string.Empty;
    public string Veprimi { get; set; } = string.Empty;
    public string Pershkrimi { get; set; } = string.Empty;
    public DateTime Data { get; set; }
}