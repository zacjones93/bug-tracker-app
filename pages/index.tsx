import type { GetServerSideProps, NextPage } from 'next'
import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'

import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';

const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

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
  console.log({bugs})
  return (
  <div className='w-52'>
    {bugs ? bugs.map((bug: any, index: number) => (
        <Bug bug={bug} index={index} key={bug.id} />
    )) : null}
  </div>
  )
}


const Home: NextPage = (props) => {

  const [state, setState] = useState({bugs: props.data});

  
  
  function onDragEnd(result: any) {
    console.log({result, state})
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    if (result.destination.droppableId === result.source.droppableId) {
      const bugs = reorder(
        state.bugs,
        result.source.index,
        result.destination.index
      );

      setState({ bugs });
    }

    
    

    
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-20 text-center bg-slate-500">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='gap-4'>
            <Droppable droppableId="inbox">
              {(provided: any) => (
                <div ref={provided.innerRef} {...provided.droppableProps}
                  className="h-[60vh] p-4 overflow-scroll bg-slate-600 rounded-sm"
                >
                  {state ? <BugList bugs={state.bugs} /> : null}
                  
                  {provided.placeholder}
                </div>
              )}
            </Droppable>            
          </div>
          
          
        </DragDropContext>
      </main>

    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ query }) => {

  resetServerContext()   // <-- CALL RESET SERVER CONTEXT, SERVER SIDE

  const inbox = Array.from({ length: 10 }, (v, k) => k).map(k => {
    const custom = {
      id: `id-${k}`,
      content: `Bug ${k}`
    };
  
    return custom;
  });

  const initial = Array.from({ length: 10 }, (v, k) => k).map(k => {
    const custom = {
      id: `id-${k}`,
      content: `Bug ${k}`
    };
  
    return custom;
  });

  return {props: { data : initial }}

}

export default Home
