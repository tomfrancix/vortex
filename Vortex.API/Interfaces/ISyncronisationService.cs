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
    /// The interface for managing auth tokens.
    /// </summary>
    public interface ISyncronisationService
    {
        event EventHandler<SyncronisationEvent> ProjectMessageReceived;
        event EventHandler<UserJoinedEvent> UserJoined;
                          

        void RaiseUserJoined(UserJoinedEvent args);

        /// <summary>
        /// This can be used to send data to all the other group members.
        /// </summary>
        /// <returns></returns>
        void RaiseProjectDataReceived(SyncronisationEvent args);
    }
}
