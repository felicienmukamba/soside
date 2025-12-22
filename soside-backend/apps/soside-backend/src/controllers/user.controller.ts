import { Controller, Get, Post, Body, Inject, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    findAll() {
        return this.authClient.send('find_all_users', {});
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    findOne(@Param('id') id: string) {
        return this.authClient.send('get_user_by_id', id);
    }

    @Patch(':id/role')
    @ApiOperation({ summary: 'Update user role' })
    updateRole(@Param('id') id: string, @Body() data: { role: string }) {
        return this.authClient.send('update_user_role', { id, role: data.role });
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user' })
    remove(@Param('id') id: string) {
        return this.authClient.send('remove_user', id);
    }
}
