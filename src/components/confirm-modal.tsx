import {
	Button,
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@aldresus/design-system";

interface ConfirmModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	title: string;
	description: string;
	/** Wording on the danger button — say the deed, not "OK". */
	confirmLabel: string;
}

/** Every irreversible action in the sidebar goes through this. */
export function ConfirmModal({
	open,
	onOpenChange,
	onConfirm,
	title,
	description,
	confirmLabel,
}: ConfirmModalProps) {
	return (
		<Modal open={open} onOpenChange={onOpenChange}>
			<ModalContent size="sm">
				<ModalHeader>
					<ModalTitle>{title}</ModalTitle>
					<ModalDescription>{description}</ModalDescription>
				</ModalHeader>
				<ModalFooter>
					<ModalClose render={<Button variant="ghost">Annuler</Button>} />
					<Button
						variant="danger"
						onClick={() => {
							onConfirm();
							onOpenChange(false);
						}}
					>
						{confirmLabel}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
