namespace Vortex.API.Events
{
    public class UserJoinedEvent
    {
        public string ConnectionId { get; set; }
        public string ProjectIdentifier { get; set; }
    }
}
