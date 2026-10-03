namespace backend.DTOs.ProjectMember;
public class ProjectMemberReadDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string EmriProjektit { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string EmriPerdoruesit { get; set; } = string.Empty;
    public string EmailPerdoruesit { get; set; } = string.Empty;
    public string RoliNeProjekt { get; set; } = string.Empty;
}