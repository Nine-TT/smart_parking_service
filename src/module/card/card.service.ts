import { Injectable } from '@nestjs/common';
import { Card } from 'src/entities/card.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CardDto, UpdateCardDTO } from 'src/dto/card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  // viết lại hàm tạo thẻ với truyền vào là 1 danh sách cardId?
  async createCard(data: CardDto): Promise<any> {
    try {
      let listCards = [];

      for (const element of data.cardId) {
        const existingCard = await this.cardRepository.findOneBy({
          cardId: element,
        });

        if (!existingCard) {
          const card = {
            cardId: element,
            state: true,
            isMonthlyTicket: false,
          };

          listCards.push(card);
        }
      }

      if (listCards.length > 0) {
        const cardSave = await this.cardRepository.save(listCards);
        return cardSave;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }

  // async getCardById(id: string) {
  //   try {
  //     const card = await this.cardRepository
  //       .createQueryBuilder('card')
  //       .leftJoinAndSelect('card.user', 'user')
  //       .where('card.id = :id', { id })
  //       .getOne();

  //     return card;
  //   } catch (error) {
  //     throw new Error('Internal server error');
  //   }
  // }

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

  async updateCard(data: UpdateCardDTO, id: number) {
    try {
      const card = await this.cardRepository.findOneBy({
        id,
      });

      if (!card) {
        return 0;
      } else {
        card.cardId = data.cardId;
        card.state = data.state;
        card.isMonthlyTicket = data.isMonthlyTicket;

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
