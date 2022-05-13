import type { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'

import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';

const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const insert = (arr: any[], index: number, newItem: any) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
]

function Bug({ bug, index }: {bug: any, index: any}) {
  return (
    <Draggable draggableId={bug.id} index={index}>
      {(provided: any) => (
        // width: 200px;
        // border: 1px solid grey;
        // margin-bottom: ${grid}px;
        // background-color: lightblue;
        // padding: ${grid}px;
        <div
          className='p-4 mb-4 bg-blue-100 border-blue-200 rounded w-52'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {bug.content}
        </div>
      )}
    </Draggable>
  );
}

const BugList = ({bugs}: {bugs: any[]}) => {
  return (
  <div className='w-52'>
    {bugs ? bugs.map((bug: any, index: number) => (
        <Bug bug={bug} index={index} key={bug.id} />
    )) : null}
  </div>
  )
}


const Home: NextPage = (props) => {
  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
      setwinReady(true);
  }, []);

  const [state, setState] = useState(props.data);

  function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }
    
    
    
    if (result.destination.droppableId === result.source.droppableId) {
      if (result.destination.index === result.source.index) return
      let destinationColumn = state[result.destination.droppableId]
      let sourceColumn = state[result.source.droppableId]

      const sourceBugs = reorder(
        sourceColumn.list,
        result.source.index,
        result.destination.index
      );
      
      let newCol = {
        id: destinationColumn.id,
        list: sourceBugs
      }
      
      setState({ 
        ...state,
        [destinationColumn.id]: {
          ...newCol
        }
      });
    }

    if (result.destination.droppableId != result.source.droppableId) {
      console.log("HEEERRREEEE")
      let destinationColumn = state[result.destination.droppableId]
      let sourceColumn = state[result.source.droppableId]
      let bugToBeMoved = state[result.source.droppableId].list[result.source.index]

      let newSourceList = sourceColumn.list.filter((el: any, i: number) => {
        return i !== result.source.index
      })

      let newDestinationList = insert(destinationColumn.list, result.destination.index, bugToBeMoved)

      

      let newSourceCol = {
        id: sourceColumn.id,
        list: newSourceList
      }

      let newDestCol = {
        id: destinationColumn.id,
        list: newDestinationList
      }
      
      setState({ 
        ...state,
        [sourceColumn.id]: {
          ...newSourceCol
        },
        [destinationColumn.id]: {
          ...newDestCol
        }
      });
    }
  }

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center flex-1 w-full px-20 text-center bg-slate-500">
        {winReady ? <DragDropContext onDragEnd={onDragEnd}>
          <div className='flex gap-4'>
            <div>
              <h1>{state.inbox.id}</h1>
              <Droppable droppableId={state.inbox.id}>
                {(provided: any) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}
                    className="h-[60vh] p-4 overflow-scroll bg-slate-600 rounded-sm"
                  >
                    {state ? <BugList bugs={state.inbox.list} /> : null}
                    
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div>
              <h1>{state.workingOn.id}</h1>
              <Droppable droppableId={state.workingOn.id}>
                {(provided: any) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}
                    className="h-[60vh] p-4 overflow-scroll bg-slate-600 rounded-sm"
                  >
                    {state ? <BugList bugs={state.workingOn.list} /> : null}
                    
                    {provided.placeholder}
                  </div>
                )}
              </Droppable> 
            </div>
            <div>
              <h1>{state.done.id}</h1>
              <Droppable droppableId={state.done.id}>
                {(provided: any) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}
                    className="h-[60vh] p-4 overflow-scroll bg-slate-600 rounded-sm"
                  >
                    {state ? <BugList bugs={state.done.list} /> : null}
                    
                    {provided.placeholder}
                  </div>
                )}
              </Droppable> 
            </div>               
          </div>      
        </DragDropContext> : null}
      </main>

    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async ({query}) => {

  //resetServerContext()   // <-- CALL RESET SERVER CONTEXT, SERVER SIDE

  const inbox = Array.from({ length: 10 }, (v, k) => k).map(k => {
    const custom = {
      id: `id-${k}`,
      content: `Bug ${k}`
    };
  
    return custom;
  });

  const initialColumns = {
    inbox: {
      id: 'inbox',
      list: inbox
    },
    workingOn: {
      id: 'workingOn',
      list: [{id: "123", content: "bug 123"}]
    },
    done: {
      id: 'done',
      list: []
    }
  }

  

  return {props: { data: initialColumns }}

}

export default Home
