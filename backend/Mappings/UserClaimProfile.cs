using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.UserClaim;

namespace backend.Mappings;
public class UserClaimProfile : Profile
{
    public UserClaimProfile()
    {
        CreateMap<UserClaimCreateDto, UserClaim>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<UserClaim, UserClaimReadDto>();
    }
}