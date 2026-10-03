using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.Projects;

namespace backend.Mappings;
public class ProjectProfile : Profile
{
    public ProjectProfile()
    {
        CreateMap<ProjectCreateDto, Project>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Statusi, opt => opt.MapFrom(_ => "Aktiv"));
        
        CreateMap<ProjectUpdateDto, Project>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.OwnerId, opt => opt.Ignore());
        
        CreateMap<ProjectStatusDto, Project>()
            .ForMember(dest => dest.Id,              opt => opt.Ignore())
            .ForMember(dest => dest.Emertimi,        opt => opt.Ignore())
            .ForMember(dest => dest.Pershkrimi,      opt => opt.Ignore())
            .ForMember(dest => dest.DataFillimit,    opt => opt.Ignore())
            .ForMember(dest => dest.DataPerfundimit, opt => opt.Ignore())
            .ForMember(dest => dest.OwnerId,         opt => opt.Ignore());

        CreateMap<Project, ProjectReadDto>()
            .ForMember(dest => dest.EmriPronarit, opt => opt.MapFrom(src => $"{src.Owner.Emri} {src.Owner.Mbiemri}"))
            .ForMember(dest => dest.NumriAnetareve, opt => opt.MapFrom(src => src.Anetaret.Count))
            .ForMember(dest => dest.NumriDetyrave, opt => opt.MapFrom(src => src.Detyrat.Count))
            .ForMember(dest => dest.DetyratPerfunduara, opt => opt.MapFrom(src => src.Detyrat.Count(d => d.Statusi == "Perfunduar")));

    }
}