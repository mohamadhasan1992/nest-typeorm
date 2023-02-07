import { Body, Controller, Post, UseGuards, Patch, Param } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorators';
import { User } from 'src/users/users.entity';
import { ApproveReportDto } from './dtos/approve-report-dto';
import { CreateReportDto } from './dtos/create-report-dto';
import { ReportDto } from './dtos/report-dto';
import { ReportsService } from './reports.service';
import { AdminGuard } from 'src/guards/admin-guard';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService){}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User){
        return this.reportsService.create(body, user);
    }

    @UseGuards(AdminGuard)
    @Patch('/:id')
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto){
        return this.reportsService.changeApproval(parseInt(id), body.approved)
    }

}
