namespace backend.DTOs.UserClaim;
public class UserClaimReadDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string ClaimType { get; set; } = string.Empty;
    public string ClaimValue { get; set; } = string.Empty;
}