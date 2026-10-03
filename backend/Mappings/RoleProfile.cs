using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.Roles;

namespace backend.Mappings;
public class RoleProfile : Profile
{
    public RoleProfile()
    {
        CreateMap<RoleCreateDto, Role>()
            .ForMember(dest => dest.Id,             opt => opt.Ignore())
            .ForMember(dest => dest.NormalizedName, opt => opt.MapFrom(src => src.Emertimi.ToUpperInvariant()));

        CreateMap<RoleUpdateDto, Role>()
            .ForMember(dest => dest.Id,             opt => opt.Ignore())
            .ForMember(dest => dest.NormalizedName, opt => opt.MapFrom(src => src.Emertimi.ToUpperInvariant()));

        CreateMap<Role, RoleReadDto>();
    }
}