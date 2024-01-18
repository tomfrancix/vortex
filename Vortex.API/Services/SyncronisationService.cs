using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Vortex.API.Events;
using Vortex.API.Models;
using Vortex.API.SignalR;

namespace Vortex.API.Services
{
    /// <summary>
    /// The service for managing auth tokens.
    /// </summary>
    public class SyncronisationService : ISyncronisationService
    {
        public event EventHandler<UserJoinedEvent>? UserJoined;
        public event EventHandler<SyncronisationEvent>? ProjectMessageReceived;

        public void RaiseUserJoined(UserJoinedEvent args)
        {
            UserJoined?.Invoke(this, args);
        }


        public void RaiseProjectDataReceived(SyncronisationEvent args)
        {
            ProjectMessageReceived?.Invoke(this, args);
        }
    }
}
