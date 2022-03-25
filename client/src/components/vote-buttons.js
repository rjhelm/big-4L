import { IconButton, VStack, Text } from "@chakra-ui/core";
import React, { useState, useEffect } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import db from '../lib/firebase';

const VoteButtons = ({ post }) => {
    const [isVoting, setVoting] = useState(false);
    const [votedPosts, setVotedPosts] = useState([]);

    useEffect(() => {
        // Fetch prev voted items from localStorage.
        const votesFromLocalStorage = localStorage.getItem('votes') || [];
        let previousVotes = [];

        try {
            // Parse the value of the item from LocalStorage. If isnt an array JS will throrw an error.
            previousVotes = JSON.parse(votesFromLocalStorage);
        } catch (error) {
            console.error(error);
        }
        setVotedPosts(previousVotes);
    }, []);

    const handleDisablingOfVoting = (postId) => {
        // This function is responsible for disabling the voting button after a
        // user has voted. Fetch the previously voted items from localStorage. See
        // https://stackoverflow.com/a/52607524/1928724 on why we need "JSON.parse"
        // and update the item on localStorage.
        const previousVotes = votedPosts;
        previousVotes.push(postId);

        setVotedPosts(previousVotes);

        // Update the voted items from localStorage. See https://stackoverflow.com/a/52607524/1928724 on why we need "JSON.stringify" and update the item on localStorage.
        localStorage.setItem("votes", JSON.stringify(votedPosts));
    };

    const handleClick = async (type) => {
        setVoting(true);
        // Do calculation to save the vote
        let upVotesCount = post.upVotesCount;
        let downVotesCount = post.downVotesCount;
        const date = new Date();
        if (type === 'upvote') {
            upVotesCount = upVotesCount + 1;
        } else {
            downVotesCount = downVotesCount + 1;
        }
        await db.collection('posts').doc(post.id).update({
            title: post.title,
            upVotesCount,
            downVotesCount,
            createdAt: post.createdAt,
            updatedAt: date.toUTCString(),
        });

        handleDisablingOfVoting(post.id);
        setVoting(true);
    };

    const checkIfPostIsAlreadyVoted = () => {
        if (votedPosts.indexOf(post.id) > -1) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <>
            <VStack>
                <IconButton
                    size="lg"
                    colorScheme="blue"
                    aria-label="Upvote"
                    icon={<FiArrowUp />}
                    onClick={() => handleClick('upvote')}
                    isLoading={isVoting}
                    isDisabled={checkIfPostIsAlreadyVoted()}
                />
                <Text bg="gray.100" rounded="md" w="100%" p={1}>{post.upVotesCount}</Text>
            </VStack>
            <VStack>
                <IconButton
                    size="lg"
                    colorScheme="red"
                    aria-label="Downvote"
                    icon={<FiArrowDown />}
                    onClick={() => handleClick('downvote')}
                    isLoading={isVoting}
                    isDisabled={checkIfPostIsAlreadyVoted()}
                />
                <Text bg="gray.100" rounded="md" w="100%" p={1}>{post.downVotesCount}</Text>
            </VStack>
        </>
    );
}

export default VoteButtons;