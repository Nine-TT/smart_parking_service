import { Injectable } from '@nestjs/common';
import { Card } from 'src/entities/card.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CardDto } from 'src/dto/card.dto';
import { MyGateway } from '../websocket/event.gateway';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly soketService: MyGateway,
  ) {}

  async createCard(data: CardDto): Promise<any> {
    try {
      const card = await this.cardRepository.save(data);
      this.soketService.server.emit('onCardCreated', 'create card success');
      return card;
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }

  async getCardById(id: string) {
    try {
      const card = await this.cardRepository
        .createQueryBuilder('card')
        .leftJoinAndSelect('card.user', 'user')
        .where('card.id = :id', { id })
        .getOne();

      return card;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async getAllCard({ page, pageSize }) {
    try {
      const skip = (page - 1) * pageSize;

      const [cards, count] = await this.cardRepository.findAndCount({
        skip,
        take: pageSize,
      });

      const dataCard = {
        cards: cards,
        count: count,
      };

      return dataCard;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async updateCard(data: CardDto, id: string) {
    try {
      const card = await this.cardRepository.findOneBy({
        id,
      });

      if (!card) {
        return 0;
      } else {
        card.expirationDate = data.expirationDate;

        if (data.userId !== undefined) {
          card.user.id = data.userId;
        }

        const response = await this.cardRepository.save(card);

        return response;
      }
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async deleteCard(ids: string | string[]): Promise<number> {
    try {
      const cardIds = Array.isArray(ids) ? ids : [ids];

      const deleteResult = await this.cardRepository
        .createQueryBuilder()
        .delete()
        .from(Card)
        .whereInIds(cardIds)
        .execute();

      const deletedCount = deleteResult.affected ?? 0;
      return deletedCount;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }
}
