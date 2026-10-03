namespace backend.Models.Identity;
public class Sprint
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Emertimi { get; set; } = string.Empty;    // p.sh. "Sprint 1", "Sprint 2"
        public DateTime DataFillimit { get; set; }
        public DateTime DataPerfundimit { get; set; }
        public string Statusi { get; set; } = "Planifikuar";    // Planifikuar, Aktiv, Perfunduar
 
        public Project Project { get; set; } = null!;
    }