

export class BadRequestError extends Error{
    constructor(message: string){
        super(message)
        this.name = "BadRequestError"
    }
}

export class NotFoundError extends Error{
    constructor(message: string){
        super(message)
        this.name = "NotFoundError"
    }
}

export class UnAuthorizedError extends Error{
    constructor(message: string){
        super(message)
        this.name = "UnAuthorizedError"
    }
}