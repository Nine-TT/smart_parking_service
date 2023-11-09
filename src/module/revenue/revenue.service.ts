import { Injectable } from '@nestjs/common';
import { Reevenue } from 'src/entities/revenue.entity';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ticket_type } from 'src/constants';

@Injectable()
export class RevenueService {
  constructor(
    @InjectRepository(Reevenue)
    private readonly revenueRepository: Repository<Reevenue>,
  ) {}

  async getTotalRevenue(year?: number, type?: string) {
    try {
      if (year && type === undefined) {
        const total = await this.getTotalRevenueALL(year);
        return total;
      } else if (year && type) {
        const total = await this.getTotalRevenueALL(year, type);
        return total;
      } else if (year === undefined && type === undefined) {
        const revenues = await this.revenueRepository.find();

        const yearlyTotal = {};

        for (const revenue of revenues) {
          const year = revenue.created_at.getFullYear();
          if (yearlyTotal[year]) {
            yearlyTotal[year] += revenue.expense;
          } else {
            yearlyTotal[year] = revenue.expense;
          }
        }

        return yearlyTotal;
      } else if (year === undefined && type) {
        const revenues = await this.revenueRepository.find({
          where: { type: type },
        });

        const yearlyTotal = {};

        for (const revenue of revenues) {
          const year = revenue.created_at.getFullYear();
          if (yearlyTotal[year]) {
            yearlyTotal[year] += revenue.expense;
          } else {
            yearlyTotal[year] = revenue.expense;
          }
        }

        return yearlyTotal;
      }
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async getTotalRevenueALL(year?: number, type?: string) {
    if (year && type === undefined) {
      const startOfTheYear = new Date(year, 0, 1);
      const endOfTheYear = new Date(year, 11, 31, 23, 59, 59);

      const monthlyRevenue = Array(12).fill(0);

      const revenues = await this.revenueRepository.find({
        where: {
          created_at: Between(startOfTheYear, endOfTheYear),
        },
      });

      for (const revenue of revenues) {
        const month = revenue.created_at.getMonth();
        monthlyRevenue[month] += revenue.expense;
      }

      const result = {};
      for (let i = 0; i < 12; i++) {
        const monthName = new Date(year, i, 1).toLocaleString('default', {
          month: 'long',
        });
        result[monthName] = monthlyRevenue[i];
      }

      return result;
    } else if (year && type) {
      console.log(year, type);

      const startOfTheYear = new Date(year, 0, 1);
      const endOfTheYear = new Date(year, 11, 31, 23, 59, 59);

      const monthlyRevenue = Array(12).fill(0);

      const revenues = await this.revenueRepository.find({
        where: {
          created_at: Between(startOfTheYear, endOfTheYear),
          type: type,
        },
      });

      for (const revenue of revenues) {
        const month = revenue.created_at.getMonth();
        monthlyRevenue[month] += revenue.expense;
      }

      const result = {};
      for (let i = 0; i < 12; i++) {
        const monthName = new Date(year, i, 1).toLocaleString('default', {
          month: 'long',
        });
        result[monthName] = monthlyRevenue[i];
      }

      return result;
    }
  }
}
