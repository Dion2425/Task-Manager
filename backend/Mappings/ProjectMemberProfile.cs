using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.ProjectMember;

namespace backend.Mappings;
public class ProjectMemberProfile : Profile
{
    public ProjectMemberProfile()
    {
        CreateMap<ProjectMemberCreateDto, ProjectMember>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<ProjectMemberUpdateDto, ProjectMember>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.ProjectId, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore());

        CreateMap<ProjectMember, ProjectMemberReadDto>()
            .ForMember(dest => dest.EmriProjektit, opt => opt.MapFrom(src => src.Project.Emertimi))
            .ForMember(dest => dest.EmriPerdoruesit, opt => opt.MapFrom(src => $"{src.User.Emri} {src.User.Mbiemri}"))
            .ForMember(dest => dest.EmailPerdoruesit, opt => opt.MapFrom(src =>src.User.Email));
    }
}