namespace backend.Models;

public class MapDrawing
{
    public Guid Id { get; set; }

    public Guid PersonId { get; set; }

    public string ShapeType { get; set; } = string.Empty;

    public string GeometryJson { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}