import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class BarberCityState {
  @PrimaryColumn()
  city!: string;

  @PrimaryColumn()
  state!: string;

  static create(city: string, state: string) {
    const barberCityState = new BarberCityState();
    barberCityState.city = city;
    barberCityState.state = state;
    return barberCityState;
  }
}
