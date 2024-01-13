﻿using Vortex.API.Models;
using Vortex.API.ViewModels;

namespace Vortex.API.Mappers
{
    /// <summary>
    /// Map model to view model.
    /// </summary>
    public class CommentMapper
    {
        private readonly UserMapper UserMapper;

        public CommentMapper(UserMapper userMapper)
        {
            UserMapper = userMapper;
        }

        public CommentViewModel Map(Comment entity)
        {
            var model = new CommentViewModel
            {
                CommentId = entity.CommentId,
                User = UserMapper.Map(entity.User),
                Content = entity.Content
            };

            return model;
        }
    }
}
