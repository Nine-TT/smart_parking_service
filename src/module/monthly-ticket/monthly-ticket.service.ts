import { Injectable } from '@nestjs/common';
import { MonthlyTicket } from 'src/entities/monthly_ticket.entity';
import { Reevenue } from 'src/entities/revenue.entity';
import { Card } from 'src/entities/card.entity';
import { Price } from 'src/entities/price.enitty';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MonthlyTicketDTO,
  UpdateLicensePlates,
  ExtendMonthlyTicket,
} from 'src/dto/monthly-ticket.dto';
import { ticket_type } from 'src/constants';

@Injectable()
export class MonthlyTicketService {
  constructor(
    @InjectRepository(MonthlyTicket)
    private readonly ticketRepository: Repository<MonthlyTicket>,

    @InjectRepository(Reevenue)
    private readonly reevenueRepository: Repository<Reevenue>,

    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,

    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async createTicket(data: MonthlyTicketDTO) {
    try {
      const card = await this.cardRepository.findOneBy({
        cardId: data.cardId,
      });

      if (card.isMonthlyTicket === false && card.state === true) {
        // tao ve thang
        const monthlyTicket = this.ticketRepository.create({
          userId: null,
          cardId: data.cardId,
          registrationDate: data.registrationDate,
          expirationDate: data.expirationDate,
          licensePlates: data.licensePlates,
        });

        await this.ticketRepository.save(monthlyTicket);

        // cap nhat trang thai the
        card.cardId = card.cardId;
        card.state = card.state;
        card.isMonthlyTicket = true;
        card.monthlyTicket = monthlyTicket;

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

  async getAllMonthlyTicket({ page, pageSize }) {
    try {
      const skip = (page - 1) * pageSize;

      const [cards, count] = await this.ticketRepository.findAndCount({
        relations: ['user'],
        skip,
        take: pageSize,
      });

      const data = {
        cards: cards,
        count: count,
      };

      return data;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async updateLicensePlates(data: UpdateLicensePlates) {
    try {
      const ticket = await this.ticketRepository.findOneBy({
        id: data.ticketId,
      });

      if (ticket) {
        ticket.licensePlates = data.licensePlates;
        const saveTicket = await this.ticketRepository.save(ticket);
        return saveTicket;
      } else {
        return 0;
      }
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async extendMonthlyTicket(data: ExtendMonthlyTicket) {
    try {
      const ticket = await this.ticketRepository.findOneBy({
        id: data.ticketId,
      });

      const card = await this.cardRepository.findOneBy({
        cardId: ticket.cardId,
      });

      if (ticket) {
        //cap nhat lai thoi gian dung the

        ticket.cardId = ticket.cardId;
        ticket.licensePlates = ticket.licensePlates;
        ticket.user = ticket.user;
        ticket.userId = ticket.userId;
        ticket.registrationDate = data.registrationDate;
        ticket.expirationDate = data.expirationDate;

        await this.ticketRepository.save(ticket);

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
}
