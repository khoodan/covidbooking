import express from 'express';

export class Endpoint {
  router: express.Router;
  path: string;

  constructor(path = "/", router?: express.Router) {
    this.path = path;
    this.router = router ? router : express.Router(); 
  }

  addChild(node: Endpoint) {
    this.router.use(node.path, node.router);
  }
}