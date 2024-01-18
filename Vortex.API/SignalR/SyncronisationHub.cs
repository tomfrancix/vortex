using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;
using Vortex.API.Events;
using Vortex.API.Services;

namespace Vortex.API.SignalR
{
    /// <summary>
    /// A SignalR hub to keep tasks, steps, and comments in sync on the website.
    /// </summary>
    public class SyncronisationHub : Hub
    {
        private readonly ISyncronisationService EventService;

        public SyncronisationHub(ISyncronisationService eventService)
        {
            EventService = eventService;
            EventService.UserJoined += OnUserJoined;
            EventService.ProjectMessageReceived += SendMessageToProjectGroup;
        }

        private async void OnUserJoined(object sender, UserJoinedEvent args)
        {
            await Groups.AddToGroupAsync(args.ConnectionId, args.ProjectIdentifier);
        }

        /// <summary>
        /// This can be used to send data to all the other group members.
        /// </summary>>
        /// <returns></returns>
        public async void SendMessageToProjectGroup(object sender, SyncronisationEvent args)
        {
            await Clients.Group(args.ProjectIdentifier).SendAsync("ReceiveMessage", $"{Context.ConnectionId}: {args.Message}");
        }
    }
}
