import { Injectable } from '@nestjs/common';
import {
  TicketRequestDTO,
  TicketRequestAcceptDTO,
} from 'src/dto/ticket-request.dto';
import { MonthlyTicketRequest } from 'src/entities/monthly_ticket_request.entity';
import { MonthlyTicket } from 'src/entities/monthly_ticket.entity';
import { Reevenue } from 'src/entities/revenue.entity';
import { Price } from 'src/entities/price.enitty';
import { Card } from 'src/entities/card.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ticket_type } from 'src/constants';

@Injectable()
export class TicketRequestService {
  constructor(
    @InjectRepository(MonthlyTicketRequest)
    private readonly requestTicketRepository: Repository<MonthlyTicketRequest>,

    @InjectRepository(MonthlyTicket)
    private readonly monthlyTicketRepository: Repository<MonthlyTicket>,

    @InjectRepository(Reevenue)
    private readonly reevenueRepository: Repository<Reevenue>,

    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,

    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async createRequest(data: TicketRequestDTO) {
    try {
      const checkRequest = await this.requestTicketRepository.findOneBy({
        userId: data.userId,
      });

      if (!checkRequest) {
        const request = this.requestTicketRepository.create({
          userId: data.userId,
          licensePlates: data.licensePlates,
          isAccept: false,
        });

        const saveRequest = await this.requestTicketRepository.save(request);

        return saveRequest;
      } else {
        return 0;
      }
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async acceptRequest(data: TicketRequestAcceptDTO) {
    try {
      const request = await this.requestTicketRepository.findOneBy({
        id: data.requestId,
      });

      if (request) {
        request.userId = request.userId;
        request.licensePlates = data.licensePlates;
        request.isAccept = true;

        await this.requestTicketRepository.save(request);

        // tao ve thang
        const monthlyTicket = this.monthlyTicketRepository.create({
          userId: request.userId,
          cardId: data.cardId,
          registrationDate: data.registrationDate,
          expirationDate: data.expirationDate,
          licensePlates: data.licensePlates,
        });

        await this.monthlyTicketRepository.save(monthlyTicket);

        //cap nhat trang thai the
        const card = await this.cardRepository.findOneBy({
          cardId: data.cardId,
        });

        card.cardId = card.cardId;
        card.isMonthlyTicket = true;
        card.monthlyTicket = monthlyTicket;
        card.state = card.state;

        await this.cardRepository.save(card);

        // tao doanh thu
        let price = await this.priceRepository.findOneBy({
          key: ticket_type.monthlyTicket,
        });

        const reevenue = this.reevenueRepository.create({
          type: ticket_type.monthlyTicket,
          expense: price.price,
          parkingLotId: null,
          card: card,
        });

        await this.reevenueRepository.save(reevenue);

        return 1;
      } else {
        return 0;
      }
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async getAllTicketRequest() {
    try {
      // Lấy tất cả các yêu cầu với isAccept: false
      const requests = await this.requestTicketRepository.find({
        where: { isAccept: false },
        relations: ['user'], // Sử dụng tên quan hệ đã đặt trong entity MonthlyTicketRequest
      });
      return requests;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async getRequestByUserId(id: number) {
    try {
      const request = await this.requestTicketRepository.findOneBy({
        userId: id,
      });

      return request;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }
}
