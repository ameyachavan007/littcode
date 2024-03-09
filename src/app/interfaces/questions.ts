export interface IQuestions {
    difficulty: string,
    title: string,
    // id: string,
    solvedStatus: ISolvedStatus[]
}

export interface ISolvedStatus {
    pid: string,
    status: boolean
}

export interface IPartipants {
    id: string,
    name: string
}

export interface IGroup {
    name: string,
    participants: IPartipants[],
    question: IQuestions[]

}