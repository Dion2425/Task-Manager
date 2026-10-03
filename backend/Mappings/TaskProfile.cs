using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.Tasks;

namespace backend.Mappings;
public class TaskProfile : Profile
{
    public TaskProfile()
    {
        CreateMap<TaskCreateDto, Models.Identity.Task>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<TaskUpdateDto, Models.Identity.Task>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.ProjectId, opt => opt.Ignore());

        CreateMap<TaskStatusUpdateDto, Models.Identity.Task>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.ProjectId, opt => opt.Ignore())
            .ForMember(dest => dest.Titulli, opt => opt.Ignore())
            .ForMember(dest => dest.Pershkrimi, opt => opt.Ignore())
            .ForMember(dest => dest.Prioriteti, opt => opt.Ignore())
            .ForMember(dest => dest.AssignedTo, opt => opt.Ignore())
            .ForMember(dest => dest.DataAfatit, opt => opt.Ignore());

        CreateMap<Models.Identity.Task, TaskReadDto>()
            .ForMember(dest => dest.EmriProjektit, opt => opt.MapFrom(src => src.Project.Emertimi))
            .ForMember(dest => dest.EmriPerdoruesitCaktuar, opt => opt.MapFrom(src => src.PerdoruesiCaktuar != null ? $"{src.PerdoruesiCaktuar.Emri} {src.PerdoruesiCaktuar.Mbiemri}" : null))
            .ForMember(dest => dest.NumriKomenteve, opt => opt.MapFrom(src => src.Komentet.Count))
            .ForMember(dest => dest.NumriBashkangjitjeve, opt => opt.MapFrom(src => src.Bashkangjitjet.Count))
            .ForMember(dest => dest.Etiketat, opt => opt.MapFrom(src => src.Etiketat.Select(tl => tl.Label.Emertimi).ToList()));
    }
}