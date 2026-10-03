namespace backend.Models.Identity;

public class Project
{
    
    public int Id { get; set; }
    public string Emertimi { get; set; } = string.Empty;
    public string Pershkrimi { get; set; } = string.Empty;
    public DateTime DataFillimit { get; set; } = DateTime.UtcNow;
    public DateTime? DataPerfundimit { get; set; }
    public string Statusi { get; set; } = "Aktiv";
    public int OwnerId { get; set; }

    public User Owner { get; set; } = null!;
    public ICollection<ProjectMember> Anetaret { get; set; } = new List<ProjectMember>();
    public ICollection<Task> Detyrat { get; set; } = new List<Task>();
    public ICollection<Sprint> Sprintet { get; set; } = new List<Sprint>();
    public ICollection<ActivityLog> AktivitetetLog { get; set; } = new List<ActivityLog>();
}