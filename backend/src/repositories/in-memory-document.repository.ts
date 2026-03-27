import { DocumentRepository, Document } from "./document.repository";

const store = new Map<string, Document>();

export class InMemoryDocumentRepository implements DocumentRepository {
  create(doc: Document): void {
    store.set(doc.id, doc);
  }

  get(id: string): Document | undefined {
    return store.get(id);
  }

  update(doc: Document): void {
    store.set(doc.id, doc);
  }

  findByHash(hash: string): Document | undefined {
    for (const doc of store.values()) {
      if (doc.hash === hash) return doc;
    }
    return undefined;
  }
}
