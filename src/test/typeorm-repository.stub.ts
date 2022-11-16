import { BaseEntity } from "@/common/entities/base-entity";

type findOptions<T> = {
  where?: {
    [P in keyof T]: T[P]
  }
  skip?: number
  take?: number
}

export class StubTypeOrmRepository<T extends BaseEntity> {
  #data: T[] = [];
  #autoIncreamentKey: number = 1;

  private partialCompareWithOriginal<T>(t: T, partialT: Partial<T>): boolean {
    for (const prop in partialT) {
        if (t[prop] !== partialT[prop]) {
            return false;
        }
    }
    return true;
  }

  private getBaseEntity() {
    const id = this.#autoIncreamentKey;
    this.#autoIncreamentKey++;
    const createdAt = new Date();
    const updatedAt = new Date(createdAt);
    const deletedAt = null;
    return { id, createdAt, updatedAt, deletedAt };
  }

  async find(findOptions?: findOptions<T>): Promise<Array<T>> {
    let foundAll = this.#data.filter(d => d?.deletedAt === null);

    if (findOptions?.where !== undefined) {
      for (const key in findOptions.where) {
        foundAll = foundAll.filter(d => d[key] === findOptions.where?.[key]);
      }
    }

    if (findOptions?.skip || findOptions?.take) {
      const startPoint = typeof findOptions.skip == 'number' ? findOptions.skip : 0;
      const selectCount = typeof findOptions.take === 'number' ? findOptions.take : 0;
      return foundAll.slice(startPoint, startPoint + selectCount);
    }
    return foundAll; 
  }

  async findBy(partialT: Partial<T>): Promise<Array<T>> {
    return (await this.find()).filter((d: T) => this.partialCompareWithOriginal(d, partialT));
  }


  async findOne(findOptions?: findOptions<T>): Promise<T | null> {
    let foundAll = this.#data.filter(d => d?.deletedAt === null);
    if (findOptions?.where !== undefined) {
      for (const key in findOptions.where) {
        foundAll = foundAll.filter(d => d[key] === findOptions.where?.[key]);
      }
    }
    return foundAll.length > 0 ? foundAll[0] : null
  }

  async findOneBy(partialT: Partial<T>): Promise<T | null> {
    const found = (await this.find()).find((d: T) => this.partialCompareWithOriginal(d, partialT));
    return found ? found : null;
  }

  async save(partialT: Partial<T>): Promise<T> {
    const selectedTIndex = this.#data.findIndex(db => (db?.deletedAt === null && db.id === partialT.id));

    //update
    if (selectedTIndex !== -1) {
      const updateT = { ...this.#data[selectedTIndex], ...partialT };
      updateT.updatedAt = new Date();
      this.#data.splice(selectedTIndex, 1, updateT);
      return updateT;
    }
    
    //create
    const t = partialT as T;
    const baseEntity = this.getBaseEntity();
    const saveEntity = { ...t, ...baseEntity };
    this.#data.push(saveEntity);
    return saveEntity;
  }

  async softRemove(t: T | T[]): Promise<void> {
    if (Array.isArray(t)) {
      await this.#softRemoveArray(t);
    } else {
      await this.#softRemoveOne(t);
    }
  }

  async #softRemoveOne(t: T): Promise<void> {
    for (let i = 0; i < this.#data.length; i++) {
      if (this.#data[i].id === t.id) {
        this.#data[i].deletedAt = new Date();
      }
    }
  }

  async #softRemoveArray(tArray: T[]): Promise<void> {
    for (let i = 0; i < tArray.length; i++) {
      await this.#softRemoveOne(tArray[i]);
    }
  }
}