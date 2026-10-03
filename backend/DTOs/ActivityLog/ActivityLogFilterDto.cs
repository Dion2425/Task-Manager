namespace backend.DTOs.ActivityLog;
public class ActivityLogFilterDto
{
    public int? ProjectId { get; set; }
    public int? UserId { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public string? Veprimi { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}